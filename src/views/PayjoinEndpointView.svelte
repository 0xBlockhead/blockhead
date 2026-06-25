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
		'endpointUrl',
		'protocolVersion',
		'$directory',
	],
	content: {
		dl: [
			[
				'endpointUrl',
				'protocolVersion',
				'$directory',
				{
					label: 'latest capability snapshot',
				},
				{
					label: 'local session count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Capability snapshots',
				items: [
					{
						label: 'timestamped receiver capability observations',
					},
				],
			},
			{
				label: 'Local sessions',
				items: [
					{
						label: 'BlockheadPayjoinSession rows',
					},
				],
			},
			{
				label: 'Directory',
				items: [
					{
						label: 'Payjoin directory when an OHTTP directory is involved',
					},
				],
			},
			{
				label: 'Receiver exchange',
				items: [
					{
						label: 'accepted query parameters',
					},
					{
						label: 'response status',
					},
					{
						label: 'well-known error codes from local probes/sessions',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'BIP21 pj=/pjos= parameters',
					},
					{
						label: 'OHTTP relay context',
					},
					{
						label: 'receiver HTTP responses',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blockhead-sessions',
			label: 'blockhead sessions',
			field: '$$blockheadSessions',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.PayjoinEndpoint>
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
	entityType={EntityType.PayjoinEndpoint}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
