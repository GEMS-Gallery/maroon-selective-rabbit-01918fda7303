import React, { useState, useEffect } from 'react';
import { Container, Grid, Button, Typography, Paper, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { backend } from 'declarations/backend';

interface Player {
  lifeTotal: number;
  commanderDamage: number[];
}

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameState();
  }, []);

  const fetchGameState = async () => {
    try {
      const gameState = await backend.getGameState();
      setPlayers(gameState.map(player => ({
        lifeTotal: Number(player.lifeTotal),
        commanderDamage: player.commanderDamage.map(Number)
      })));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching game state:', error);
      setLoading(false);
    }
  };

  const updateLifeTotal = async (playerId: number, change: number) => {
    try {
      await backend.updateLifeTotal(playerId, BigInt(change));
      await fetchGameState();
    } catch (error) {
      console.error('Error updating life total:', error);
    }
  };

  const updateCommanderDamage = async (playerId: number, opponentId: number, change: number) => {
    try {
      await backend.updateCommanderDamage(playerId, opponentId, BigInt(change));
      await fetchGameState();
    } catch (error) {
      console.error('Error updating commander damage:', error);
    }
  };

  const resetGame = async () => {
    try {
      await backend.resetGame();
      await fetchGameState();
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          MTG Commander Life Counter
        </Typography>
        <Grid container spacing={2}>
          {players.map((player, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h5">Player {index + 1}</Typography>
                <Typography variant="h3">{player.lifeTotal}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => updateLifeTotal(index, 1)}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => updateLifeTotal(index, -1)}
                    startIcon={<RemoveIcon />}
                    sx={{ ml: 1 }}
                  >
                    Remove
                  </Button>
                </Box>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Commander Damage
                </Typography>
                <Grid container spacing={1}>
                  {player.commanderDamage.map((damage, opponentIndex) => (
                    index !== opponentIndex && (
                      <Grid item xs={4} key={opponentIndex}>
                        <Typography>From P{opponentIndex + 1}: {damage}</Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => updateCommanderDamage(index, opponentIndex, 1)}
                        >
                          +
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => updateCommanderDamage(index, opponentIndex, -1)}
                          sx={{ ml: 1 }}
                        >
                          -
                        </Button>
                      </Grid>
                    )
                  ))}
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button variant="contained" color="secondary" onClick={resetGame}>
            Reset Game
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default App;
