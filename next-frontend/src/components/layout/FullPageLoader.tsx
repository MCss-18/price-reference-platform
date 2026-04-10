import { Loader } from "lucide-react";

interface Props {
  text?: string;
}

const FullPageLoader: React.FC<Props> = ({ text = "Cargando sistema..." }) => (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-[rgba(255,255,255,.2)] text-2xl">
    <Loader size={30} className="animate-spin mr-2" />
    {text}
  </div>
);

export default FullPageLoader;