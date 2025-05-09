import { Button } from './ui/Button';

export type Option = {
	id: string;
	label: string;
	action: (id: string) => void;
};

type Props = {
	options: Option[];
	active: string;
};

export const TabSwitcher = ({ options, active }: Props) => {
	return (
		<div className="flex gap-1 bg-neutral-200 rounded-lg w-fit p-1">
			{options.map(({ id, label, action }) => (
				<Button
					variant="ghost"
					className={`!p-2 h-[24px] rounded-sm bg-neutral-300 text-neutral-400 cursor-pointer hover:bg-neutral-300 ${active === id ? 'text-neutral-950' : 'bg-neutral-200'}`}
					key={id}
					onClick={() => action(id)}
				>
					{label}
				</Button>
			))}
		</div>
	);
};
