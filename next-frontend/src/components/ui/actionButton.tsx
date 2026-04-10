import { PencilLine, Trash2, Eye } from 'lucide-react';
import { JSX } from 'react';

type ActionType = 'edit' | 'delete' | 'view';

interface ActionButtonProps {
  onClick: () => void;
  type: ActionType;
  disabled?: boolean
}

const actionStyles: Record<ActionType, string> = {
  edit: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-500 hover:text-yellow-700',
  delete: 'bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-700',
  view: 'bg-blue-100 hover:bg-blue-200 text-blue-500 hover:text-blue-700',
};

const actionIcons: Record<ActionType, JSX.Element> = {
  edit: <PencilLine size={16} />,
  delete: <Trash2 size={16} />,
  view: <Eye size={16} />,
};

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, type, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      className={`p-1 rounded-md ${actionStyles[type]} transition-colors`}
      aria-label={type}
      disabled={disabled}
    >
      {actionIcons[type]}
    </button>
  );
};

export { ActionButton };
