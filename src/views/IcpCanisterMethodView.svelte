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
				label: 'canister',
			},
			{
				label: 'method name',
			},
			{
				label: 'method kind',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'canister',
					},
					{
						label: 'method name',
					},
					{
						label: 'method kind',
					},
					{
						label: 'latest Candid signature',
					},
					{
						label: 'certification support',
					},
					{
						label: 'request count when indexed',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Canister',
					items: [
						{
							label: 'parent ICP canister',
						},
					],
				},
				{
					label: 'Interface history',
					items: [
						{
							label: 'timestamped method/interface observations',
						},
					],
				},
				{
					label: 'Requests',
					items: [
						{
							label: 'request-status rows filtered by canister/method when known',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'Candid interface or dashboard payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpCanisterMethod>
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
	entityType={EntityType.IcpCanisterMethod}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
