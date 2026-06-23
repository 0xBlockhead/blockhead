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
				label: 'validator account',
			},
			{
				label: 'public key',
			},
			{
				label: 'latest stake/status/performance observation',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'validator account',
					},
					{
						label: 'public key',
					},
					{
						label: 'latest stake/status/performance observation',
					},
					{
						label: 'account link',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Validator observations',
					items: [
						{
							label: 'epoch-scoped validator-set observations',
						},
					],
				},
				{
					label: 'Account',
					items: [
						{
							label: 'validator NEAR account',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent NEAR network',
						},
					],
				},
				{
					label: 'Epoch groups',
					items: [
						{
							label: 'current',
						},
						{
							label: 'next',
						},
						{
							label: 'proposal',
						},
						{
							label: 'fisherman',
						},
						{
							label: 'kickout facets when source payloads expose them',
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
			selection: EntityProxyResource<typeof schema, EntityType.NearValidator>
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
	entityType={EntityType.NearValidator}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
