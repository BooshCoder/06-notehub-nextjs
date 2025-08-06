import { fetchNoteById } from "../../../lib/api";
import NoteDetailsClient from "./NoteDetails.client";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

interface NotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NotePage({ params }: NotePageProps) {
  const queryClient = new QueryClient();
  const { id } = await params;
  
  // Prefetch data on server
  const initialData = await fetchNoteById(id);
  
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient initialData={initialData} />
    </HydrationBoundary>
  );
} 