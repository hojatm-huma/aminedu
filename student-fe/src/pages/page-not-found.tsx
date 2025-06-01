import { CONFIG } from 'src/config-global';

import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`404 صفحه پیدا نشد! | خطا - ${CONFIG.appName}`}</title>

      <NotFoundView />
    </>
  );
}
