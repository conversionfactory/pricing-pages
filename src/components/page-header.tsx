type PageHeaderProps = {
  title: string
  subtitle?: string
  count?: number
}

export function PageHeader({ title, subtitle, count }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
        {count !== undefined && (
          <span className="ml-2 text-lg font-normal text-muted-foreground">
            ({count})
          </span>
        )}
      </h1>
      {subtitle && (
        <p className="text-lg text-muted-foreground max-w-2xl">{subtitle}</p>
      )}
    </div>
  )
}
