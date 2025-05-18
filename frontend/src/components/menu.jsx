const sampleMenu = [
  { name: 'Pizza Margarita', price: '$10' },
  { name: 'Ensalada César', price: '$7' },
  { name: 'Pasta Alfredo', price: '$12' },
];

const Menu = () => (
  <section id="menu" className="p-8">
    <h2 className="text-2xl font-semibold mb-4">Nuestro Menú</h2>
    <ul className="grid gap-4 md:grid-cols-2">
      {sampleMenu.map((item, i) => (
        <li key={i} className="border p-4 rounded shadow hover:shadow-lg">
          <h3 className="text-xl font-bold">{item.name}</h3>
          <p className="text-gray-700">{item.price}</p>
        </li>
      ))}
    </ul>
  </section>
);

export default Menu;
