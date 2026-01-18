import React from 'react'
import { useThreadStore } from '@/store/dataStore';
import ListItem from './ListItem';
import { Virtuoso } from 'react-virtuoso';

const SidebarList = () => {
    const { threads } = useThreadStore();

    return (
        <div className="flex-1 min-h-0">
            <Virtuoso
                className='mt-2'
                style={{ height: '100%' }}
                data={threads}
                itemContent={(index, thread) => (
                    <div className="mb-1">
                        <ListItem 
                            key={thread.id} 
                            threadId={thread.id} 
                            fileName={thread.fileName}
                        />
                    </div>
                )}
            />
        </div>
    )
}

export default SidebarList