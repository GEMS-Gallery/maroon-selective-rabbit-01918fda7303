import React, { useState, useEffect } from 'react';
import { Container, Grid, Button, Typography, Paper, Box, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { backend } from 'declarations/backend';

interface Player {
  name: string;
  lifeTotal: number;
  commanderDamage: number[];
  poisonCounter: number;
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
        name: player.name,
        lifeTotal: Number(player.lifeTotal),
        commanderDamage: player.commanderDamage.map(Number),
        poisonCounter: Number(player.poisonCounter)
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

  const updatePoisonCounter = async (playerId: number, change: number) => {
    try {
      await backend.updatePoisonCounter(playerId, BigInt(change));
      await fetchGameState();
    } catch (error) {
      console.error('Error updating poison counter:', error);
    }
  };

  const updatePlayerName = async (playerId: number, newName: string) => {
    try {
      await backend.updatePlayerName(playerId, newName);
      await fetchGameState();
    } catch (error) {
      console.error('Error updating player name:', error);
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
    <Box className="mtg-background" sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            MTG Commander Life Counter
          </Typography>
          <Grid container spacing={2}>
            {players.map((player, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper elevation={3} sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.8)' }}>
                  <TextField
                    value={player.name}
                    onChange={(e) => updatePlayerName(index, e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                  />
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
                    Poison Counter: {player.poisonCounter}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => updatePoisonCounter(index, 1)}
                      size="small"
                    >
                      +
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => updatePoisonCounter(index, -1)}
                      size="small"
                      sx={{ ml: 1 }}
                    >
                      -
                    </Button>
                  </Box>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Commander Damage
                  </Typography>
                  <Grid container spacing={1}>
                    {player.commanderDamage.map((damage, opponentIndex) => (
                      index !== opponentIndex && (
                        <Grid item xs={4} key={opponentIndex}>
                          <Typography>From {players[opponentIndex].name}: {damage}</Typography>
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
    </Box>
  );
};

export default App;
