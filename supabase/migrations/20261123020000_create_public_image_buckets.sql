insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('project-images', 'project-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Users upload own avatars" on storage.objects;
create policy "Users upload own avatars"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users update own avatars" on storage.objects;
create policy "Users update own avatars"
on storage.objects for update to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users upload own project images" on storage.objects;
create policy "Users upload own project images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'project-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users update own project images" on storage.objects;
create policy "Users update own project images"
on storage.objects for update to authenticated
using (
  bucket_id = 'project-images'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'project-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
