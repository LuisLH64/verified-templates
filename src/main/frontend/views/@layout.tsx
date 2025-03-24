import { createMenuItems, useViewConfig } from '@vaadin/hilla-file-router/runtime.js';
import { effect, signal } from '@vaadin/hilla-react-signals';
import { AppLayout, DrawerToggle, Icon, SideNav, SideNavItem } from '@vaadin/react-components';
import { EnterpriseEndpoint } from 'Frontend/generated/endpoints';
import { DialogProvider } from 'Frontend/static/utils/dialog-utils';
import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const documentTitleSignal = signal('');
effect(() => {
  document.title = documentTitleSignal.value;
});

// Publish for Vaadin to use
(window as any).Vaadin.documentTitleSignal = documentTitleSignal;

export default function MainLayout() {
  const currentTitle = useViewConfig()?.title;
  const navigate = useNavigate();
  const location = useLocation();

  const [logo, setLogo] = useState<string | null>(null);
  const id = "f35d4cfa-6687-4f65-9469-39112f4bf610"; // ID da empresa fixa (pode ser dinâmico)

  useEffect(() => {
    if (currentTitle) {
      documentTitleSignal.value = currentTitle;
    }

    EnterpriseEndpoint.findLogo(id)
      .then((image) => {
        if (image) {
          setLogo(`data:image/png;base64,${image}`);
        } else {
          setLogo(null); // Caso não tenha logo
        }
      })
      .catch(() => setLogo(null)); // Em caso de erro, evita quebra

  }, [currentTitle]);

  return (
    <DialogProvider>
      <AppLayout primarySection="drawer">
        <div slot="drawer" className="flex flex-col justify-between h-full p-m">
          <header className="flex flex-col gap-m">
            {/* <span className="font-semibold text-l">Verified</span> */}
            {logo ? (
              <img 
                src={logo} 
                loading="lazy" 
                alt="Empresa Logo"
              />
            ) : (
              <p>Carregando logo...</p>
            )}
            <SideNav onNavigate={({ path }) => navigate(path!)} location={location}>
              {createMenuItems().map(({ to, title, icon }) => (
                <SideNavItem path={to} key={to}>
                  {icon ? <Icon src={icon} slot="prefix"></Icon> : <></>}
                  {title}
                </SideNavItem>
              ))}
            </SideNav>
          </header>
        </div>

        <DrawerToggle slot="navbar" aria-label="Menu toggle"></DrawerToggle>
        {/* <h1 slot="navbar" className="text-l m-0">
          {documentTitleSignal}
        </h1> */}

        <Suspense>
          <Outlet />
        </Suspense>
      </AppLayout>
    </DialogProvider>
  );
}