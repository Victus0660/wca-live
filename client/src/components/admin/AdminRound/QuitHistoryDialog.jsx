import { gql, useQuery } from "@apollo/client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";
import { parseISO, format } from "date-fns";
import Loading from "../../Loading/Loading";
import Error from "../../Error/Error";

const ROUND_REMOVALS_QUERY = gql`
  query RoundRemovals($roundId: ID!) {
    round(id: $roundId) {
      id
      removals {
        id
        replaced
        removedAt
        person {
          id
          name
          registrantId
        }
        removedBy {
          id
          name
        }
      }
    }
  }
`;

function QuitHistoryDialog({ open, onClose, roundId }) {
  const { data, loading, error } = useQuery(ROUND_REMOVALS_QUERY, {
    variables: { roundId },
    skip: !open,
    fetchPolicy: "network-only",
  });

  const removals = data?.round?.removals || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Quit history</DialogTitle>
      <DialogContent>
        {loading && <Loading />}
        {error && <Error error={error} />}
        {data && removals.length === 0 && (
          <Typography color="textSecondary" sx={{ py: 2 }}>
            No competitors have been quit from this round.
          </Typography>
        )}
        {data && removals.length > 0 && (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Competitor</TableCell>
                  <TableCell>Removed by</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Replaced</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {removals.map((removal) => (
                  <TableRow key={removal.id}>
                    <TableCell>
                      <span translate="no">{removal.person.name}</span>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ ml: 1 }}
                      >
                        #{removal.person.registrantId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <span translate="no">{removal.removedBy.name}</span>
                    </TableCell>
                    <TableCell>
                      {format(parseISO(removal.removedAt), "MMM d, HH:mm")}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={removal.replaced ? "Yes" : "No"}
                        size="small"
                        color={removal.replaced ? "primary" : "default"}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default QuitHistoryDialog;
