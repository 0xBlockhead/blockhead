<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	closed: [
		'$network',
		'endpointUrl',
		'endpointKind',
	],
	content: {
		dl: [
			[
				'$network',
				'endpointUrl',
				'endpointKind',
				'source',
				'timestampMs',
			],
			[
				{
					label: 'CORS/proxy policy',
				},
				'health',
				'latencyMs',
				'error',
				{
					label: 'source freshness',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network',
				items: [
					'$network',
				],
			},
			{
				label: 'Endpoint',
				items: [
					{
						label: 'URL',
					},
					'endpointKind',
					{
						label: 'source definition or catalog origin',
					},
				],
			},
			{
				label: 'Browser policy',
				items: [
					'corsEnabled',
					'proxyAllowed',
				],
			},
			{
				label: 'Health check',
				items: [
					'health',
					'latencyMs',
					'error',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'runtime probe',
					},
					{
						label: 'catalog/source freshness',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.NetworkEndpointObservation_Timestamp>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.NetworkEndpointObservation_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
