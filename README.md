## habit-tracker-2026

### Run

```bash
pnpm install
pnpm launch
```

### Supabase env setup

- Copy the example env file:

```bash
cp .env/.env.example .env/.env.local
```

- Fill in:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

### Supabase: enable fetching table columns (schema) from the app

The app uses an RPC called `get_table_columns` to fetch column metadata for a table.
Run this SQL in Supabase (SQL editor):

```sql
create or replace function public.get_table_columns(table_name text)
returns table (
  column_name text,
  data_type text,
  is_nullable boolean,
  ordinal_position int
)
language sql
security definer
set search_path = public
as $$
  select
    c.column_name::text,
    c.data_type::text,
    (c.is_nullable = 'YES') as is_nullable,
    c.ordinal_position::int
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = get_table_columns.table_name
  order by c.ordinal_position;
$$;

grant execute on function public.get_table_columns(text) to anon, authenticated;
```

### Other scripts

```bash
pnpm dev
pnpm build
pnpm preview
```


