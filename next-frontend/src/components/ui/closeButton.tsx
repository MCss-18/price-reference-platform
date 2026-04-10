import React from 'react'
import {Button} from './button'
import { X } from 'lucide-react';

interface CloseButtonProps {
  closeForm: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({closeForm}) =>{
  return (
    <Button 
      className="absolute top-5 right-5 bg-transparent !text-[var(--t-tertiary)] hover:bg-red-500 hover:!text-white transition" 
      type="button" 
      onClick={closeForm}
    >
      <X />
    </Button>
  )
}

export default CloseButton