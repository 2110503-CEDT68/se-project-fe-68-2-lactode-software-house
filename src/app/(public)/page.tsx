// import Hero from '@/src/components/layout/Hero';

// export default function HomePage() {
//   return <Hero />;
  
// }

import Button from '@/src/components/common/Button';
import { LogIn } from 'lucide-react';

export default function ExamplePage() {
  return (
    <div className="flex flex-col gap-8 p-10">
      <Button>Button</Button>

      <Button variant="primary-icon" icon={<LogIn size={40} strokeWidth={2} />}>
        Button
      </Button>

      <Button variant="danger">Delete</Button>

      <Button disabled>Back</Button>
    </div>
  );
}