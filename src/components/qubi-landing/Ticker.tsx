interface TickerProps {
  items?: { id: number; text: string }[];
}

const Ticker = ({ items }: TickerProps) => {
  if (!items?.length) return null;

  const doubled = [...items, ...items];

  return (
    <div className="ticker">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span key={i}>{item.text}</span>
        ))}
      </div>
    </div>
  );
};

export default Ticker;