import ClientThreadPage from './ClientThreadPage';
import { basePath, isGhPages } from '@/lib/apiFetch';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  // Provide a small set of sample ids for GH Pages demo
  return [{ id: 't1' }];
}

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  return <ClientThreadPage id={id} />;
}

