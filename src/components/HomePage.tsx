interface HomePageProps {
  onNavigateToShop: () => void;
}

export default function HomePage({ onNavigateToShop }: HomePageProps) {
  return (
    <div className="space-y-8">
      <section className="bg-white p-8 rounded-lg shadow-md border-t-4 border-[#1B5E20]" id="vision">
        <h2 className="text-[#1B5E20]">Project Vision</h2>
        <p>
          To transform Mariano Marcos State University's student experience by providing a cutting-edge, web-based platform that streamlines and digitizes the purchase of official university clothing and accessories,
          giving students convenience, control, and transparency while bringing the university into compliance with international standards for digital service delivery.
        </p>
        <button
          onClick={onNavigateToShop}
          className="mt-4 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white px-6 py-3 rounded-md hover:opacity-90 transition-opacity shadow-md"
        >
          <span className="flex items-center gap-2">
            Start Shopping
            <span className="text-[#FFD700]">→</span>
          </span>
        </button>
      </section>
      
      <section className="bg-white p-8 rounded-lg shadow-md border-t-4 border-[#FFD700]" id="goals">
        <h3 className="text-[#1B5E20]">Project Goals</h3>
        <ul className="list-disc pl-6">
          <li>
            <strong>Enhance Accessibility:</strong> Enable students to remotely browse, reserve, and purchase official university garments through any internet-enabled device.
          </li>
          <li>
            <strong>Centralize Inventory Management:</strong> Develop a real-time inventory system for accurate visibility of available items across departments.
          </li>
          <li>
            <strong>Streamline Reservation and Ordering:</strong> Implement an intuitive reservation module to ensure timely confirmation and reduce delays from manual processes.
          </li>
          <li>
            <strong>Reduce Physical Burden:</strong> Minimize visits to multiple offices or booths, saving time and effort especially for students with mobility or scheduling constraints.
          </li>
          <li>
            <strong>Improve Transparency:</strong> Provide clear, automated status updates for every transaction to keep students informed.
          </li>
          <li>
            <strong>Modernize University Services:</strong> Adopt best practices in campus e-commerce and inventory control to position MMSU as a forward-thinking institution.
          </li>
          <li>
            <strong>Lay Groundwork for Scalability:</strong> Design the system to accommodate future enhancements like mobile access, integrated payment gateways, and analytics for demand forecasting.
          </li>
        </ul>
      </section>
    </div>
  );
}
