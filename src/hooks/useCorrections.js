import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { knowledgeKeys, useKnowledgeBackendStatus } from './useKnowledge';

const loadKnowledgeService = () => import('../services/knowledgeService').then((module) => module.default);
const correctionKey = (id) => ['knowledge', 'corrections', id];

const useCorrectionsReady = () => {
  const status = useKnowledgeBackendStatus().data;
  return status?.ready === true && status?.features?.corrections === true;
};

const pendingError = () => Object.assign(
  new Error('Verified Knowledge backend upgrade is pending.'),
  { code: 'KNOWLEDGE_SCHEMA_PENDING' },
);

export function useCorrections(postId, { enabled = true } = {}) {
  const ready = useCorrectionsReady();
  return useQuery({
    queryKey: correctionKey(postId),
    queryFn: async () => (await loadKnowledgeService()).getCorrections(postId),
    enabled: Boolean(postId) && enabled && ready,
    staleTime: 30_000,
    retry: 0,
  });
}

export function useSubmitCorrection(postId) {
  const ready = useCorrectionsReady();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => ready
      ? (await loadKnowledgeService()).submitCorrection(postId, payload)
      : Promise.reject(pendingError()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: correctionKey(postId) });
      qc.invalidateQueries({ queryKey: knowledgeKeys.dashboard });
    },
  });
}

export function useWithdrawCorrection(postId) {
  const ready = useCorrectionsReady();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (suggestionId) => ready
      ? (await loadKnowledgeService()).withdrawCorrection(suggestionId)
      : Promise.reject(pendingError()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: correctionKey(postId) });
      qc.invalidateQueries({ queryKey: knowledgeKeys.dashboard });
    },
  });
}

export function useResolveCorrection() {
  const ready = useCorrectionsReady();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ suggestionId, decision, note = '' }) => ready
      ? (await loadKnowledgeService()).resolveCorrection(suggestionId, decision, note)
      : Promise.reject(pendingError()),
    onSuccess: () => qc.invalidateQueries({ queryKey: knowledgeKeys.dashboard }),
  });
}
