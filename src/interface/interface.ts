/**
 * @file /api/types.ts
 * @fileoverview contains the type definitions of the API calls used throughout the application.
 */

import { Dispatch } from "react";
import { SetStateAction } from "react";
import { annotations, photo_annotation, video_annotation, model, model_annotation, software, tags, authorized, assignment } from "@prisma/client";

export interface SearchHeaderProps {
  headerTitle: string,
  pageRoute: string;
  searchTerm?: string;
  page?: string;
  hasModel?: boolean
};

export interface iNatApiResponse {
  total_results: number;
  page: number;
  per_page: number;
  results: any[];
};

export interface iNatSpecimenObservation {
  photoUrl: string;
  title: string;
  userIcon: string;
  pictureHrefLink: string;
  userHrefLink: string;
  observedOnDate: string;
  location: string;
};

export interface iNatSpecimenLeader {
  count?: number;
  observation_count?: number;
  user: string;
};

export interface GbifResponse {
  usageKey?: number;
  scientificName?: string;
  canonicalName?: string;
  rank: 'GENUS' | 'SPECIES';
  status?: string;
  confidence: number;
  matchType: 'EXACT' | 'NONE';
  kingdom?: string;
  phylum?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
  kingdomKey?: number;
  phylumKey?: number;
  classKey?: number;
  orderKey?: number;
  familyKey?: number;
  genusKey?: number;
  speciesKey?: number;
  synonym: boolean;
  class?: string;
  note?: string;
  alternatives?: any[];
};

export interface GbifMediaResponse {
  offset: number;
  limit: number;
  endOfRecords: boolean;
  count?: number;
  results: any[];
};

export interface GbifImageResponse {
  author: string | null;
  license?: string;
  year?: number;
  month?: number;
  day?: number;
  url: string;
};

export interface GbifProfile {
  habitat?: string;
  extinct?: string;
  terrestrial?: string;
  marine?: string;
  freshwater?: string;
};

export interface SpeciesListInfo {
  name: string;
  imgUrl: string;
  photoBy: string;
  license: string;
};

export interface CommonNameInfo {
  id: number;
  rank: string;
  iconic_taxon_id: number;
  name: string;
  default_photo?: {
    id: number;
    url: string;
    medium_url: string;
    photo_by: string;
    license: string;
  };
  wikipedia_url?: string;
  preferred_common_name: string;
};

export interface PlantIdSuggestion {
  id: number;
  plant_name: string;
  probability: number;
  confirmed: boolean;
  similar_images: {
    id: string;
    url: string;
    similarity?: number;
    url_small?: string;
  }[];
  plant_details: {
    common_names?: string[] | null;
    taxonomy: {
      class: string;
      genus: string;
      order: string;
      family: string;
      phylum: string;
      kingdom: string;
    };
    url: string;
    wiki_description?: {
      value: string;
      citation: string;
      license_name: string;
      license_url: string;
    } | null;
    synonyms?: string[] | null;
    name_authority: string;
    language: string;
    scientific_name: string;
    structured_name: {
      genus: string;
      species?: string; // Optional if present in the response
      hybrid?: string; // Optional if present in the response
    };
  };
};

export interface PlantIdApiResponseSuccess {
  id: number;
  custom_id: null;
  meta_data: {
    latitude: null;
    longitude: null;
    date: string;
    datetime: string;
  };
  uploaded_datetime: number;
  finished_datetime: number;
  images: {
    file_name: string;
    url: string;
  }[];
  suggestions: PlantIdSuggestion[];
  modifiers: string[];
  secret: string;
  fail_cause: null;
  countable: true;
  feedback: null;
  is_plant: true;
  is_plant_probability: number;
};

export interface PlantIdApiResponseError {
  id: number;
  custom_id: null;
  meta_data: {
    latitude: null;
    longitude: null;
    date: string;
    datetime: string;
  };
  uploaded_datetime: number;
  finished_datetime: number;
  images: {
    file_name: string;
    url: string;
  }[];
  suggestions: PlantIdSuggestion[];
  modifiers: string[];
  secret: string;
  fail_cause: null;
  countable: true;
  feedback: null;
  is_plant: false;
  is_plant_probability: number;
};

export type PlantIdApiResponse = PlantIdApiResponseSuccess | PlantIdApiResponseError;


export interface Models {
  confirmation: string;
  email: string;
  artistName: string;
  speciesName: string;
  createdWithMobile: boolean;
  methodology: string;
  modeluid: string;
  dateTime: Date;
  status: string;
  thumbnail: string
  lat: number
  lng: number
}[]

export interface ModelsWithTagsAndSoftware extends Models {
  software: string[]
  tags: string

}

export interface PublishedModelProps {
  models: ModelsWithTagsAndSoftware[],
  setViewerUid: Dispatch<SetStateAction<string>>,
  selectedKeys: Set<string>,
  setSelectedKeys: any,
  setPendingSelectedKeys: Dispatch<SetStateAction<Set<string>>>
  setActiveSpeciesName: Dispatch<SetStateAction<string>>
}

export interface userUpdateProps {
  confirmation: string,
  artist: string,
  species: string,
  method: string,
  mobile: boolean,
  software: string[],
}

export interface PendingModelProps {
  models: ModelsWithTagsAndSoftware[],
  setViewerUid: Dispatch<SetStateAction<string>>,
  selectedKeys: Set<string>,
  setSelectedKeys: any,
  setPublishedSelectedKeys: Dispatch<SetStateAction<Set<string>>>
  setActiveSpeciesName: Dispatch<SetStateAction<string>>
}

export interface modelerInsertion {
  requestType: 'specimenEntry' | 'imageEntry' | 'modelEntry',
  species: string
  acquisitionDate: string
}

export interface specimenInsertion extends modelerInsertion {
  procurer: string,
  isLocal: boolean,
  genus: string
}

export interface imageInsertion extends modelerInsertion {
  imagedBy: string,
  imagedDate: string,
  numberOfImages: string
}

export interface modelInsertion extends modelerInsertion {
  commonName: string,
  uid: string,
  modeler: string,
  isViable: boolean,
  isBase: boolean
}


export interface fullAnnotation extends annotations {
  annotation: photo_annotation | video_annotation | model_annotation
}

export interface fullModel extends model {
  software: software[]
  tags: tags[]
  assignment: assignment
}

export interface ManagerClientProps {
  models: string
  modelsWithThumbnails: string
  modelsNeedingThumbnails: string
  unannotatedModels: string
  studentsAssignmentsAndModels: string
  admin: boolean
}

export interface UpdateModelFormContainerProps {
  models: fullModel[] | undefined
}

export interface UpdateModelFormProps {
  model: fullModel
}

export interface studentsAndAssignments extends authorized {
  assignment: assignment[]
}

export interface studentsAssignmentsAndModels extends studentsAndAssignments {
  models: model[]
}

export interface assignmentsWithName extends assignment {
  name: string
}

export interface modelsAndAssignments extends model {
  assignment: assignment[]
}

export interface AnnotationEntryProps {
  activeAnnotation?: photo_annotation | video_annotation | model_annotation | undefined,
  specimenName?: string,
  annotationType?: string,
  index: number,
  new: boolean,
  setActiveAnnotationIndex: Dispatch<SetStateAction<number | 'new' | undefined>>,
  position: string | undefined,
  uid: string | undefined
  activeAnnotationPosition?: string
  setRepositionEnabled: Dispatch<SetStateAction<boolean>>
  repositionEnabled: boolean
  setPosition3D?: Dispatch<SetStateAction<string | undefined>>
  activeAnnotationTitle?: string
  setAnnotationSavedOrDeleted: Dispatch<SetStateAction<boolean>>
  annotationSavedOrDeleted: boolean
  annotationModels: model[]
}

export interface annotationWithModel extends annotations{
  model_annotation: model_annotation
}


