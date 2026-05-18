import sys

with open("src/components/PokemonConfigPanel.tsx", "r") as f:
    content = f.read()

# Manual string replacement to fix the merge conflict
content = content.replace("""<<<<<<< HEAD
                  aria-label={`Increase ${stat} boost`}
=======
                  disabled={config.boosts[stat] >= 6}
                  aria-label={`Increase ${stat} boost`}
                  title={config.boosts[stat] >= 6 ? "Maximum boost reached" : "Increase boost"}
>>>>>>> origin/main""", """                  disabled={config.boosts[stat] >= 6}
                  aria-label={`Increase ${stat} boost`}
                  title={config.boosts[stat] >= 6 ? "Maximum boost reached" : "Increase boost"}""")

content = content.replace("""<<<<<<< HEAD
                  aria-label={`Decrease ${stat} boost`}
=======
                  disabled={config.boosts[stat] <= -6}
                  aria-label={`Decrease ${stat} boost`}
                  title={config.boosts[stat] <= -6 ? "Minimum boost reached" : "Decrease boost"}
>>>>>>> origin/main""", """                  disabled={config.boosts[stat] <= -6}
                  aria-label={`Decrease ${stat} boost`}
                  title={config.boosts[stat] <= -6 ? "Minimum boost reached" : "Decrease boost"}""")

with open("src/components/PokemonConfigPanel.tsx", "w") as f:
    f.write(content)
