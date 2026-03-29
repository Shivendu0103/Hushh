import * as React from 'react';

import {
  Sheet as SheetPrimitive,
  SheetTrigger as SheetTriggerPrimitive,
  SheetOverlay as SheetOverlayPrimitive,
  SheetClose as SheetClosePrimitive,
  SheetPortal as SheetPortalPrimitive,
  SheetContent as SheetContentPrimitive,
  SheetHeader as SheetHeaderPrimitive,
  SheetFooter as SheetFooterPrimitive,
  SheetTitle as SheetTitlePrimitive,
  SheetDescription as SheetDescriptionPrimitive,
} from '@/components/animate-ui/primitives/radix/sheet';
import { cn } from '@/lib/utils';
import { XIcon } from 'lucide-react';

function Sheet(props) {
  return <SheetPrimitive {...props} />;
}

function SheetTrigger(props) {
  return <SheetTriggerPrimitive {...props} />;
}

function SheetOverlay({
  className,
  ...props
}) {
  return (<SheetOverlayPrimitive className={cn('fixed inset-0 z-50 bg-black/50', className)} {...props} />);
}

function SheetClose(props) {
  return <SheetClosePrimitive {...props} />;
}

function SheetContent({
  className,
  children,
  side = 'right',
  showCloseButton = true,
  ...props
}) {
  return (
    <SheetPortalPrimitive>
      <SheetOverlay />
      <SheetContentPrimitive
        className={cn(
          'bg-background fixed z-50 flex flex-col gap-4 shadow-lg',
          side === 'right' && 'h-full w-[350px] border-l',
          side === 'left' && 'h-full w-[350px] border-r',
          side === 'top' && 'w-full h-[350px] border-b',
          side === 'bottom' && 'w-full h-[350px] border-t',
          className
        )}
        side={side}
        {...props}>
        {children}
        {showCloseButton && (
          <SheetClose
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        )}
      </SheetContentPrimitive>
    </SheetPortalPrimitive>
  );
}

function SheetHeader({
  className,
  ...props
}) {
  return (<SheetHeaderPrimitive className={cn('flex flex-col gap-1.5 p-4', className)} {...props} />);
}

function SheetFooter({
  className,
  ...props
}) {
  return (<SheetFooterPrimitive className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />);
}

function SheetTitle({
  className,
  ...props
}) {
  return (<SheetTitlePrimitive className={cn('text-foreground font-semibold', className)} {...props} />);
}

function SheetDescription({
  className,
  ...props
}) {
  return (<SheetDescriptionPrimitive className={cn('text-muted-foreground text-sm', className)} {...props} />);
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };
