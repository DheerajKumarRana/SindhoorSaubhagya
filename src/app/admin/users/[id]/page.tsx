import AdminUserDetails from '@/components/Admin/AdminUserDetails';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <AdminUserDetails userId={id} />;
}
