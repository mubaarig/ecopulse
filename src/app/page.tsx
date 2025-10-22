import { redirect } from '@/navigation';
import { defaultLocale } from '../../i18n/config';

export default function RootPage() {
  redirect({ href: '/', locale: defaultLocale });
}
