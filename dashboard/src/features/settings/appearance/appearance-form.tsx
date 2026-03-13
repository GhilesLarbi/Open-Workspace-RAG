// src/features/settings/appearance/appearance-form.tsx
import { type SVGProps } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Root as Radio, Item } from '@radix-ui/react-radio-group'
import { CircleCheck, RotateCcw, ChevronDownIcon } from 'lucide-react'
import { fonts } from '@/config/fonts'
import { cn } from '@/lib/utils'

// Contexts
import { useFont } from '@/context/font-provider'
import { useTheme } from '@/context/theme-provider'
import { useDirection } from '@/context/direction-provider'
import { type Collapsible, useLayout } from '@/context/layout-provider'
import { useSidebar } from '@/components/ui/sidebar'

// UI Components
import { Button, buttonVariants } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

// The Icons you liked from the drawer
import { IconDir } from '@/assets/custom/icon-dir'
import { IconLayoutCompact } from '@/assets/custom/icon-layout-compact'
import { IconLayoutDefault } from '@/assets/custom/icon-layout-default'
import { IconLayoutFull } from '@/assets/custom/icon-layout-full'
import { IconSidebarFloating } from '@/assets/custom/icon-sidebar-floating'
import { IconSidebarInset } from '@/assets/custom/icon-sidebar-inset'
import { IconSidebarSidebar } from '@/assets/custom/icon-sidebar-sidebar'
import { IconThemeDark } from '@/assets/custom/icon-theme-dark'
import { IconThemeLight } from '@/assets/custom/icon-theme-light'
import { IconThemeSystem } from '@/assets/custom/icon-theme-system'

const appearanceFormSchema = z.object({
  theme: z.string(),
  font: z.enum(fonts),
  direction: z.string(),
  variant: z.string(),
  layout: z.string(),
})

export function AppearanceForm() {
  const { font, setFont } = useFont()
  const { theme, setTheme, defaultTheme } = useTheme()
  const { dir, setDir, defaultDir } = useDirection()
  const { variant, setVariant, defaultVariant, collapsible, setCollapsible, defaultCollapsible } = useLayout()
  const { open, setOpen } = useSidebar()

  const form = useForm<z.infer<typeof appearanceFormSchema>>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme,
      font,
      direction: dir,
      variant,
      layout: open ? 'default' : collapsible,
    },
  })

  return (
    <Form {...form}>
      <form className='space-y-12 pb-20'>
        {/* FONT SECTION (The one from your original settings) */}
        <FormField
          control={form.control}
          name='font'
          render={({ field }) => (
            <FormItem>
              <SectionTitle title='Font Family' />
              <div className='relative w-max'>
                <FormControl>
                  <select
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'w-[200px] appearance-none font-normal capitalize'
                    )}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      setFont(e.target.value as any)
                    }}
                  >
                    {fonts.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </FormControl>
                <ChevronDownIcon className='absolute end-3 top-2.5 h-4 w-4 opacity-50' />
              </div>
              <FormDescription>Choose the typeface for the dashboard.</FormDescription>
            </FormItem>
          )}
        />

        {/* THEME CONFIG (Drawer Style) */}
        <FormField
          control={form.control}
          name='theme'
          render={({ field }) => (
            <FormItem>
              <SectionTitle 
                title='Theme' 
                showReset={theme !== defaultTheme} 
                onReset={() => { setTheme(defaultTheme); field.onChange(defaultTheme); }} 
              />
              <Radio
                value={field.value}
                onValueChange={(val) => { field.onChange(val); setTheme(val as any); }}
                className='grid w-full max-w-md grid-cols-3 gap-4'
              >
                <ConfigRadioItem value='system' label='System' icon={IconThemeSystem} isTheme />
                <ConfigRadioItem value='light' label='Light' icon={IconThemeLight} isTheme />
                <ConfigRadioItem value='dark' label='Dark' icon={IconThemeDark} isTheme />
              </Radio>
            </FormItem>
          )}
        />

        {/* SIDEBAR CONFIG (Drawer Style) */}
        <FormField
          control={form.control}
          name='variant'
          render={({ field }) => (
            <FormItem>
              <SectionTitle 
                title='Sidebar Style' 
                showReset={variant !== defaultVariant} 
                onReset={() => { setVariant(defaultVariant); field.onChange(defaultVariant); }} 
              />
              <Radio
                value={field.value}
                onValueChange={(val) => { field.onChange(val); setVariant(val as any); }}
                className='grid w-full max-w-md grid-cols-3 gap-4'
              >
                <ConfigRadioItem value='inset' label='Inset' icon={IconSidebarInset} />
                <ConfigRadioItem value='floating' label='Floating' icon={IconSidebarFloating} />
                <ConfigRadioItem value='sidebar' label='Sidebar' icon={IconSidebarSidebar} />
              </Radio>
            </FormItem>
          )}
        />

        {/* LAYOUT CONFIG (Drawer Style) */}
        <FormField
          control={form.control}
          name='layout'
          render={({ field }) => (
            <FormItem>
              <SectionTitle 
                title='Layout Mode' 
                showReset={field.value !== 'default'} 
                onReset={() => { setOpen(true); setCollapsible(defaultCollapsible); field.onChange('default'); }} 
              />
              <Radio
                value={field.value}
                onValueChange={(v) => {
                  field.onChange(v)
                  if (v === 'default') setOpen(true)
                  else { setOpen(false); setCollapsible(v as Collapsible); }
                }}
                className='grid w-full max-w-md grid-cols-3 gap-4'
              >
                <ConfigRadioItem value='default' label='Default' icon={IconLayoutDefault} />
                <ConfigRadioItem value='icon' label='Compact' icon={IconLayoutCompact} />
                <ConfigRadioItem value='offcanvas' label='Full Layout' icon={IconLayoutFull} />
              </Radio>
            </FormItem>
          )}
        />

        {/* DIRECTION CONFIG (Drawer Style) */}
        <FormField
          control={form.control}
          name='direction'
          render={({ field }) => (
            <FormItem>
              <SectionTitle 
                title='Direction' 
                showReset={dir !== defaultDir} 
                onReset={() => { setDir(defaultDir); field.onChange(defaultDir); }} 
              />
              <Radio
                value={field.value}
                onValueChange={(val) => { field.onChange(val); setDir(val as any); }}
                className='grid w-full max-w-md grid-cols-3 gap-4'
              >
                <ConfigRadioItem value='ltr' label='LTR' icon={(p) => <IconDir dir='ltr' {...p} />} />
                <ConfigRadioItem value='rtl' label='RTL' icon={(p) => <IconDir dir='rtl' {...p} />} />
              </Radio>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

// --- HELPER COMPONENTS (The exact ones from your Drawer) ---

function SectionTitle({ title, showReset, onReset }: { title: string, showReset?: boolean, onReset?: () => void }) {
  return (
    <div className='mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground'>
      {title}
      {showReset && (
        <Button size='icon' variant='secondary' className='size-5 rounded-full' onClick={onReset}>
          <RotateCcw className='size-3' />
        </Button>
      )}
    </div>
  )
}

function ConfigRadioItem({ value, label, icon: Icon, isTheme = false }: { value: string, label: string, icon: any, isTheme?: boolean }) {
  return (
    <Item value={value} className='group outline-none transition duration-200 ease-in'>
      <div className={cn(
        'relative rounded-[6px] ring-[1px] ring-border',
        'group-data-[state=checked]:shadow-xl group-data-[state=checked]:ring-primary group-focus-visible:ring-2'
      )}>
        <CircleCheck className='absolute -right-1 -top-1 z-10 size-5 fill-primary stroke-white group-data-[state=unchecked]:hidden' />
        <Icon className={cn('w-full', !isTheme && 'fill-primary stroke-primary group-data-[state=unchecked]:fill-muted-foreground group-data-[state=unchecked]:stroke-muted-foreground')} />
      </div>
      <div className='mt-2 text-center text-[10px] font-medium uppercase text-muted-foreground'>{label}</div>
    </Item>
  )
}