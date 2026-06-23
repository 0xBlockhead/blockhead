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
				label: 'namespace address',
			},
			{
				label: 'namespace string',
			},
			'owner',
		],
		content: {
			dl: [
				[
					{
						label: 'namespace address',
					},
					{
						label: 'namespace string',
					},
					'owner',
					{
						label: 'token name',
					},
					{
						label: 'token symbol',
					},
					{
						label: 'created time',
					},
					'description',
					{
						label: 'total usernames',
					},
					{
						label: 'rule summary',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Usernames',
					items: [
						{
							label: 'username rows minted in this namespace',
						},
					],
				},
				{
					label: 'Owner',
					items: [
						{
							label: 'owner EVM account when resolved',
						},
					],
				},
				{
					label: 'Rules',
					items: [
						{
							label: 'namespace rules JSON',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'namespace GraphQL payload',
						},
						{
							label: 'namespace contract events when available',
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
			selection: EntityProxyResource<typeof schema, EntityType.LensUsernameNamespace>
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
	entityType={EntityType.LensUsernameNamespace}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
