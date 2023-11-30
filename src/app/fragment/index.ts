export const fragmentTitle = `fragment TitleFragment on MediaTitle {
    a: english
    b: native
    c: romaji
    d: userPreferred
}`


export const fragmentMedia: string = `fragment media on Media {
  id,
  type
  title {
    ...TitleFragment
  }
  favourites
  meanScore
  averageScore
   coverImage {
    extraLarge
    large
    medium
    color
  }
}`;


export const fragmentAllInfoOfMedia: string = `fragment allMedia on Media {
 id
    type
    title {
      ...TitleFragment
    }
    coverImage {
      extraLarge
      color
    }
    staff(page: 1, perPage: 10, sort: [RELEVANCE, ID]) {
      edges {
        id
        role
        node {
          id
          name {
            userPreferred
            native
          }
        }
      }
    }
    characters(page: 1, perPage: 10, sort: [ROLE, RELEVANCE, ID]) {
      edges {
        id
        role
        voiceActorRoles(sort: [RELEVANCE, ID], language: ENGLISH) {
          voiceActor {
            id
            name {
              userPreferred
            }
          }
        }
        node {
          id
          name {
            userPreferred
            native
          }
        }
      }
    }
    studios {
      edges {
        node {
          id
          name
        }
      }
    }
    bannerImage
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    description
    seasonYear
    type
    format
    status(version: 2)
    episodes
    duration
    chapters
    volumes
    genres
    meanScore
    averageScore
    popularity
    favourites
    countryOfOrigin
    nextAiringEpisode {
      airingAt
      timeUntilAiring
      episode
    }
    trailer {
      id
      site
    }
    rankings {
      id
      rank
      type
      format
      year
      season
      allTime
      context
    }
     relations {
      edges {
        id
        relationType(version: 2)
        node {
          id
          description
          title {
            ...TitleFragment
          }
          format
          type
          status(version: 2)
          bannerImage
          genres
          startDate {
            year
            day
            month
          }
          endDate {
            year
            day
            month
          }
          coverImage {
            large
            color
          }
        }
      }
    }
}`;
