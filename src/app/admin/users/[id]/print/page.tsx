import AdminPrintUserDetails from '@/components/Admin/AdminPrintUserDetails';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <AdminPrintUserDetails userId={id} />;
}
