import React, { ReactElement, useState } from 'react';

import { AccountBox, Analytics, Feed, Foundation } from '@mui/icons-material';
import Head from 'next/head';

import { VerticalNavigation } from '../verticalNavigation/VerticalNavigation';
import Footer from './footer/Footer';
import AdminHeader from './header/AdminHeader';
import Header from './header/Header';
import { PageItem } from '../TreeList/TreeList';

const pages: PageItem[] = [
  {
    id: 1,
    text: 'Dashboard',
    path: '/admin',
    icon: <Analytics />
  },
  {
    id: 2,
    text: 'Projetos',
    icon: <Foundation />,
    children: [
      {
        id: 5,
        text: "Criar Projeto",
        path: '/admin/projects/create',
      },
      {
        id: 6,
        text: "Projetos Atuais",
        path: '/admin/projects/current',
      },
      {
        id: 7,
        text: "Projetos Concluídos",
        path: '/admin/projects/history',
      },
    ]
  },
  {
    id: 3,
    text: 'Atualizações',
    path: '/admin/updates',
    icon: <Feed />
  },
  {
    id: 4,
    text: 'Inscrições',
    path: '/admin/enrollrequests',
    icon: <AccountBox />
  }
];

export const Layout = ({ isAdmin, children }: { isAdmin: boolean; children: ReactElement }) => {
  const [open, setOpen] = useState<boolean>(isAdmin);

  return (
    <div className="layout">
      <Head>
        <title>Cooperativa Giraldo Sem Pavor</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isAdmin ? <AdminHeader setOpen={setOpen} /> : <Header />}
      {children}
      {!isAdmin && <Footer />}
      {isAdmin ? <VerticalNavigation open={open} pages={pages} setOpen={setOpen} /> : <></>}
    </div>
  );
};

export default Layout;
