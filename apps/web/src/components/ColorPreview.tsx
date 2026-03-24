const swatches = [
  { name: "Primary", bg: "bg-primary", fg: "text-primary-foreground" },
  { name: "Secondary", bg: "bg-secondary", fg: "text-secondary-foreground" },
  { name: "Accent", bg: "bg-accent", fg: "text-accent-foreground" },
  { name: "Muted", bg: "bg-muted", fg: "text-muted-foreground" },
  { name: "Destructive", bg: "bg-destructive", fg: "text-white" },
] as const;

const chartColors = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"] as const;

export const ColorPreview = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {swatches.map(({ name, bg, fg }) => (
        <div
          key={name}
          className={`${bg} ${fg} rounded-md px-4 py-6 text-center text-sm font-medium`}
        >
          {name}
        </div>
      ))}
    </div>

    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground">Chart Palette</p>
      <div className="flex gap-2">
        {chartColors.map((color, i) => (
          <div key={i} className={`${color} h-8 flex-1 rounded-sm`} />
        ))}
      </div>
    </div>

    <div className="flex gap-3">
      <div className="rounded-md border border-border bg-card px-4 py-3 text-card-foreground">
        Card + Border
      </div>
      <div className="rounded-md bg-input px-4 py-3 text-foreground ring-2 ring-ring">
        Input + Ring
      </div>
    </div>
  </div>
);
