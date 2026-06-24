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
			label: 'registration file',
		},
		{
			label: 'target kind',
		},
		{
			label: 'selector hash',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'registration file',
				},
				{
					label: 'target kind',
				},
				{
					label: 'target selector hash algorithm/hash',
				},
			],
			[
				{
					label: 'target selector',
				},
				{
					label: 'evidence URI',
				},
				'signature',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Registration file',
				items: [
					{
						label: 'Eip8004AgentRegistrationFile',
					},
				],
			},
			{
				label: 'Target',
				items: [
					{
						label: 'selector JSON',
					},
				],
			},
			{
				label: 'Evidence',
				items: [
					{
						label: 'URI/signature',
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
			selection: EntityProxyResource<typeof schema, EntityType.Eip8004CrossRegistration>
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
	entityType={EntityType.Eip8004CrossRegistration}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
