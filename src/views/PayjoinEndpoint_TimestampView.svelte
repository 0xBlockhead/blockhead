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
		'$endpoint',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$endpoint',
				'timestampMs',
				'source',
				{
					label: 'output-substitution support',
				},
				{
					label: 'OHTTP requirement',
				},
			],
			[
				'maxPayloadBytes',
				{
					label: 'last seen time',
				},
				'responseStatus',
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Endpoint',
				items: [
					{
						label: 'parent Payjoin endpoint',
					},
				],
			},
			{
				label: 'Local sessions',
				items: [
					{
						label: 'BlockheadPayjoinSession rows when this observation came from a session',
					},
				],
			},
			{
				label: 'Directory',
				items: [
					{
						label: 'Payjoin directory when OHTTP-mediated',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'BIP21 parameters',
					},
					{
						label: 'OHTTP relay context',
					},
					{
						label: 'receiver response/error payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.PayjoinEndpoint_Timestamp>
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
	entityType={EntityType.PayjoinEndpoint_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
