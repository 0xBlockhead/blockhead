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
				label: 'transaction',
			},
			{
				label: 'authorization index',
			},
			{
				label: 'chain id',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'transaction',
					},
					{
						label: 'authorization index',
					},
					{
						label: 'chain id',
					},
					'authority',
					{
						label: 'delegation address',
					},
					'nonce',
					{
						label: 'yParity/r/s',
					},
					{
						label: 'verification status/time',
					},
					{
						label: 'authority account',
					},
					{
						label: 'delegation contract',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Transaction',
					items: [
						{
							label: 'parent EVM transaction',
						},
					],
				},
				{
					label: 'Authority',
					items: [
						{
							label: 'authority EVM network account',
						},
					],
				},
				{
					label: 'Delegation contract',
					items: [
						{
							label: 'delegation EVM contract',
						},
					],
				},
				{
					label: 'Signature evidence',
					items: [
						{
							label: 'raw tuple',
						},
						{
							label: 'local recovery status fields',
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
			selection: EntityProxyResource<typeof schema, EntityType.Eip7702Authorization>
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
	entityType={EntityType.Eip7702Authorization}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
