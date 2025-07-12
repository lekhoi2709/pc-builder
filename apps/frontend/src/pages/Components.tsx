import { useQuery } from '@tanstack/react-query';
import { GetAllComponents } from '../services/api';

export default function Components() {
  const query = useQuery({
    queryKey: ['components'],
    queryFn: GetAllComponents,
  });

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  if (!query.data) {
    return <div>No data found</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-transparent">
      <h1 className="mb-4 text-2xl font-bold">Components</h1>
      <div className="flex grid-cols-1 flex-wrap gap-4">
        {query.data.map(component => (
          <div
            key={component.id}
            className="max-w-[30%] rounded-lg border p-4 shadow-md transition-shadow duration-200 hover:shadow-lg"
          >
            <img
              src={component.image_url[0] || '/placeholder.png'}
              alt={component.name}
              className="mb-2 h-32 w-full rounded object-cover"
            />
            <h2 className="text-lg font-semibold">{component.name}</h2>
            <p className="text-sm">{component.category}</p>
            <p className="text-sm">{component.brand}</p>
            <p className="text-sm">{component.models}</p>
            <p>{JSON.stringify(component.specs)}</p>
            <p>{JSON.stringify(component.price)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
