package services

import (
	"context"
	"fmt"
	"mime/multipart"
	"path/filepath"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type CloudinaryService struct {
	cld          *cloudinary.Cloudinary
	uploadPreset string
}

func NewCloudinaryService(cloudName, apiKey, apiSecret, uploadPreset string) (*CloudinaryService, error) {
	cld, err := cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize Cloudinary: %w", err)
	}

	return &CloudinaryService{
		cld:          cld,
		uploadPreset: uploadPreset,
	}, nil
}

func (s *CloudinaryService) UploadImage(ctx context.Context, file multipart.File, header *multipart.FileHeader) (string, error) {
	ext := strings.ToLower(filepath.Ext(header.Filename))
	allowedExts := map[string]bool{".jpg": true, ".jpeg": true, ".png": true, ".gif": true}

	if !allowedExts[ext] {
		return "", fmt.Errorf("invalid file type: %s", ext)
	}

	if header.Size > 5*1024*1024 {
		return "", fmt.Errorf("file too large: max 5MB")
	}

	uploadResult, err := s.cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder:         "components",
		ResourceType:   "image",
		Overwrite:      api.Bool(false),
		UniqueFilename: api.Bool(true),
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload to Cloudinary: %w", err)
	}

	return uploadResult.SecureURL, nil
}

func (s *CloudinaryService) UploadMultipleImages(ctx context.Context, files []*multipart.FileHeader) ([]string, error) {
	var urls []string

	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			return nil, fmt.Errorf("failed to open file: %w", err)
		}
		defer file.Close()

		url, err := s.UploadImage(ctx, file, fileHeader)
		if err != nil {
			return nil, err
		}

		urls = append(urls, url)
	}

	return urls, nil
}

func (s *CloudinaryService) DeleteImage(ctx context.Context, imageURL string) error {
	parts := strings.Split(imageURL, "/")
	if len(parts) < 2 {
		return fmt.Errorf("invalid Cloudinary URL")
	}

	for i := len(parts) - 1; i >= 0; i-- {
		if strings.HasPrefix(parts[i], "v") && len(parts[i]) > 1 {
			publicIDParts := parts[i+1:]
			publicID := strings.Join(publicIDParts, "/")
			publicID = strings.TrimSuffix(publicID, filepath.Ext(publicID))

			_, err := s.cld.Upload.Destroy(ctx, uploader.DestroyParams{
				PublicID:     publicID,
				ResourceType: "image",
			})
			return err
		}
	}

	return fmt.Errorf("could not extract public ID from URL")
}

func (s *CloudinaryService) GetOptimizedURL(imageURL string, width, height int) string {
	parts := strings.Split(imageURL, "/upload/")
	if len(parts) != 2 {
		return imageURL
	}

	transformation := fmt.Sprintf("w_%d,h_%d,c_fit,q_auto,f_auto", width, height)
	return fmt.Sprintf("%s/upload/%s/%s", parts[0], transformation, parts[1])
}

func (s *CloudinaryService) GetThumbnailURL(imageURL string) string {
	return s.GetOptimizedURL(imageURL, 300, 300)
}
