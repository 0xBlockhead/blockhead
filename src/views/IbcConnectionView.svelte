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
			{
				label: 'network',
			},
			{
				label: 'connection id',
			},
			{
				label: 'client id',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'connection id',
					},
					{
						label: 'client id',
					},
					{
						label: 'client ref',
					},
					{
						label: 'counterparty client/connection',
					},
					'state',
					{
						label: 'delay period',
					},
					{
						label: 'channel count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Channels',
					items: [
						{
							label: 'IBC channels over this connection',
						},
					],
				},
				{
					label: 'Client',
					items: [
						{
							label: 'linked IBC client',
						},
					],
				},
				{
					label: 'Counterparty',
					items: [
						{
							label: 'counterparty client/connection ids',
						},
						{
							label: 'resolved network when available',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'connection',
						},
						{
							label: 'connection-channels query payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.IbcConnection>
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
	entityType={EntityType.IbcConnection}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
