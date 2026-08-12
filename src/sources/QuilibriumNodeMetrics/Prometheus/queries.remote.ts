import { query } from '$app/server'

import { getMetrics as getMetricsFromNode } from '$/sources/QuilibriumNodeMetrics/Prometheus/queries.ts'

export const getMetrics = query(() => getMetricsFromNode())
