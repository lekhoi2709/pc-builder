import { useQuery } from '@tanstack/react-query';
import { GetAllComponents } from '../services/api';
import ComponentCard from '../components/ComponentCard';

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
    <section className="z-0 flex min-h-screen w-full flex-col items-center bg-transparent">
      <h1 className="mb-4 text-2xl font-bold">Components</h1>
      <main className="flex w-full">
        <section className="w-1/4">Hello</section>
        <section className="flex w-3/4 flex-wrap justify-start gap-8 p-4">
          {query.data.map(component => (
            <ComponentCard key={component.id} component={component} />
          ))}
        </section>
      </main>
    </section>
  );
}
