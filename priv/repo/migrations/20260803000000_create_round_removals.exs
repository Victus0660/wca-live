defmodule WcaLive.Repo.Migrations.CreateRoundRemovals do
  use Ecto.Migration

  def change do
    create table(:round_removals) do
      add :round_id, references(:rounds, on_delete: :delete_all), null: false
      add :person_id, references(:people, on_delete: :delete_all), null: false
      add :removed_by_id, references(:users, on_delete: :nothing), null: false
      add :replaced, :boolean, null: false, default: false
      add :removed_at, :utc_datetime, null: false

      timestamps()
    end

    create index(:round_removals, [:round_id])
    create index(:round_removals, [:person_id])
  end
end
