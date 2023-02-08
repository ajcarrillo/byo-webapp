export type AccountType = {
  readonly value: string;
  readonly label: string;
  readonly isDisabled?: boolean;
  readonly description: string;
}

const accountTypesCreator: readonly AccountType[] = [
  {value: 'creator-music-musician', label: 'Musician or Band', description: 'I want to share my music.', isDisabled: false},
  {value: 'creator-music-producer', label: 'Music Producer', description: 'I want to share my mixes.', isDisabled: false},
  {value: 'creator-artist-digital', label: 'Digital Artist', description: 'I want to share my 2D or 3D artwork.', isDisabled: true},
  {value: 'creator-film-maker', label: 'Filmmaker', description: 'I want to share my films and videos.', isDisabled: true},
  {value: 'creator-photographer', label: 'Photographer', description: 'I want to share my photography.', isDisabled: true},
  {value: 'creator-lierature-writer', label: 'Author or Screenwriter', description: 'I want to share my books or screenplays.', isDisabled: true},
]

const accountTypesPromoter: readonly AccountType[] = [
  {value: 'promoter-music-dj', label: 'Radio DJ', description: 'I want to share my music.', isDisabled: true},
  {value: 'promoter-music-bands', label: 'Band Promoter', description: 'I want to promote music, merchandise and gigs.', isDisabled: true},
  {value: 'promoter-music-curator', label: 'Playlist Curator', description: 'I want to compile musical playlists.', isDisabled: true},
]

const accountTypesCollector: readonly AccountType[] = [
  {value: 'collector-music', label: 'Music Lover', description: 'I\'m primarily looking for new music.', isDisabled: false},
  {value: 'collector-nft', label: 'NFT Collector', description: 'I\'m primarily looking to buy and sell NFT\'s.', isDisabled: true},
  {value: 'collector-art', label: 'Art Lover', description: 'I\'m primarily looking for new artwork.', isDisabled: true},
  {value: 'collector-film', label: 'Film Buff', description: 'I\'m primarily looking for new films and videos.', isDisabled: true},
]

interface IGroupedAccountOption {
  readonly label: string,
  readonly options: readonly AccountType[],
}

export const groupedAccountOptions: readonly IGroupedAccountOption[] = [
  {
    label: 'Creator',
    options: accountTypesCreator,
  },
  {
    label: 'Promoter',
    options: accountTypesPromoter,
  },
  {
    label: 'Collector',
    options: accountTypesCollector,
  },
]

export const allAccountTypes = [...accountTypesCreator, ...accountTypesPromoter, ...accountTypesCollector]