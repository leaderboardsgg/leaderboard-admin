import { Ref, ref, watchEffect } from 'vue'
import { Leaderboards } from '../lib/api/Leaderboards'
import { LeaderboardViewModel, ListLeaderboardsParams } from '../lib/api/data-contracts'
import { RequestParams } from '../lib/api/http-client'

export default function useGetLeaderboards(query: Ref<ListLeaderboardsParams, ListLeaderboardsParams>, params?: RequestParams) {
  const leaderboardClient = new Leaderboards({
		baseUrl: 'http://localhost:8000'
	})

	const boards = ref<LeaderboardViewModel[]>([])

	watchEffect(async () => {
		const r = await leaderboardClient.listLeaderboards(query.value, params)
		boards.value = r.data ?? []
	})

	return boards.value
}
