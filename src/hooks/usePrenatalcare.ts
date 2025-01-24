import useSWR from 'swr';

const API_BASE_URL = 'http://hii1sc.inf.pucp.edu.pe/openmrs/ws/rest/v1/encounter';

interface Observation {
  uuid: string;
  display: string;
}

interface EncounterResponse {
  obs: Observation[];
}

export function useEncounterObservations(encounterId: string) {
  // Construir la URL de la API con el parámetro `encounterId`
  const fetchUrl = `${API_BASE_URL}/${encounterId}?v=custom:(obs:(uuid,display))`;

  // Llamado a la API con SWR
  const { data, error, isLoading } = useSWR<EncounterResponse, Error>(fetchUrl, async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching encounter: ${response.statusText}`);
    }
    return response.json();
  });

  return {
    observations: data?.obs || [],
    isLoading,
    isError: !!error,
  };
}
