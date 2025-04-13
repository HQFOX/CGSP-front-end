import { Collapse, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React, { ReactNode, useId, useState } from 'react';
import { StyledListItemButton } from '../verticalNavigation/VerticalNavigation';
import Link from 'next/link';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import router from 'next/router';

export interface PageItem {
    id: number,
    text: string,
    path?: string,
    icon?: ReactNode,
    children?: PageItem[];
    open?: boolean;
}

const TreeItem = ({id, icon, text, path, children, open: openProp = false}: PageItem) => {

    const [open, setOpen] = useState(openProp);

    const uniqueId = useId();

    const item = (<ListItem key={id}>
    <StyledListItemButton key={id + "button"} onClick={() => setOpen(!open)} selected={router.pathname === path}>
        { icon && <ListItemIcon>{icon}</ListItemIcon>}
        { text && <ListItemText>{text}</ListItemText>}
        { children && (open ? <ExpandLess /> : <ExpandMore />)}
    </StyledListItemButton>
</ListItem>)

    if(path){

        return(
            <Link
            key={id + "link"}
            href={path}
            passHref
            style={{ width: '100%' }}
            >
                {item}
            </Link>
        )
    }
    return (
        <div key={uniqueId}>
        {item}
        {children && 
            <Collapse key={id + "collapse"} in={open} timeout="auto">
                <List key={id + "list"} component="div" disablePadding dense>
                    {children.map(item => TreeItem(item))}
                </List>
            </Collapse>
        }
        </div >
    )
}

export const TreeList = ({pages}:{ pages: PageItem[]}) => {

    return (
        <List
            component="nav"
        >
            {pages.map( page => TreeItem(page))}
        </List>
    )
}