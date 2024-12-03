import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function Home() {
  return <ProtectedRoute redirectTo="/login">Home</ProtectedRoute>;
}
