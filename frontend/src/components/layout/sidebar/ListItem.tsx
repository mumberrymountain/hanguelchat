import React, { useState } from 'react'
import ItemMenuButton from './ItemMenuButton';
import ItemText from './ItemText';

interface SidebarListItemProps {
  threadId: string;
  fileName: string;
}

const SidebarListItem = ({ threadId, fileName }: SidebarListItemProps) => {
    const [showMenuButton, setShowMenuButton] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(fileName);

    return (
      
      <div className="flex items-center justify-between group p-2 rounded">
        <ItemText threadId={threadId} fileName={fileName} setShowMenuButton={setShowMenuButton} 
                             isEditing={isEditing} setIsEditing={setIsEditing} editValue={editValue} setEditValue={setEditValue}/>
        {showMenuButton && <ItemMenuButton threadId={threadId} fileName={fileName} setShowMenuButton={setShowMenuButton} 
                                                      isEditing={isEditing} setIsEditing={setIsEditing} editValue={editValue} setEditValue={setEditValue}/>}
      </div>
    )
}

export default SidebarListItem