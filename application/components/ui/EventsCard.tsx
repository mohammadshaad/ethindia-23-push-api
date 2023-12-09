"use client"

import { useState } from "react";
import { useContract, useContractWrite } from "@thirdweb-dev/react";

const EventsCard: React.FC = () => {
  const [owner, setOwner] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const { contract } = useContract("0xaD98E636f9bE52841F6009e66C91719f2c0057D1");
  const { mutateAsync: createEvents, isLoading } = useContractWrite(contract, "createEvents");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await createEvents({
        args: [owner, title, description, date, price],
      });
      console.info("Contract call success", data);
    } catch (err) {
      console.error("Contract call failure", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Owner:
        <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} />
      </label>
      <br />
      <label>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <br />
      <label>
        Description:
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <br />
      <label>
        Date:
        <input type="text" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <br />
      <label>
        Price:
        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
      </label>
      <br />
      <button type="submit" disabled={isLoading}>
        Create Event
      </button>
    </form>
  );
};

export default EventsCard;
