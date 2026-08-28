const TRANSITIONS_AUTORISEES = {
  en_attente: ['confirmee', 'annulee'],
  confirmee: ['annulee'],
  annulee: [],
};

function transitionAutorisee(statutActuel, statutCible) {
  return TRANSITIONS_AUTORISEES[statutActuel]?.includes(statutCible) ?? false;
}

module.exports = { transitionAutorisee };