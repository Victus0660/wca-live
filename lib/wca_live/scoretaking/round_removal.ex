defmodule WcaLive.Scoretaking.RoundRemoval do
  @moduledoc """
  Records the removal ("quit") of a competitor from a round.

  This serves as an audit log so that scoretakers can review
  which competitors were quit, and delegates can see who
  performed each removal.
  """

  use WcaLive.Schema
  import Ecto.Changeset

  alias WcaLive.Accounts
  alias WcaLive.Competitions
  alias WcaLive.Scoretaking

  schema "round_removals" do
    field :replaced, :boolean, default: false
    field :removed_at, :utc_datetime

    belongs_to :round, Scoretaking.Round
    belongs_to :person, Competitions.Person
    belongs_to :removed_by, Accounts.User

    timestamps()
  end

  @doc """
  Creates a changeset for a new round removal record.
  """
  def changeset(round_removal, attrs) do
    round_removal
    |> cast(attrs, [:replaced, :removed_at, :round_id, :person_id, :removed_by_id])
    |> validate_required([:replaced, :removed_at, :round_id, :person_id, :removed_by_id])
    |> foreign_key_constraint(:round_id)
    |> foreign_key_constraint(:person_id)
    |> foreign_key_constraint(:removed_by_id)
  end
end
