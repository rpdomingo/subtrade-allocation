import { ChangeEvent, useState } from "react";
import { Child } from "../models/Child";
import { Parent } from "../models/Parent";



interface Props {
    child: Child[];
}

export default function () {
    const [parent, setParent] = useState<Parent>({ParentID: 1, MonthlyQuantity: 1000});
    const [children, setChildren] = useState<Child[]>([]);

    const [newChildAllocation, setNewChildAllocation] = useState<number>(0);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setNewChildAllocation(Number(e.target.value));
    };

    //Compute the Cascading Remainders
    const computeCascadingRemainders = (currentChildren: Child[], parentQty: number): Child[] => {
        let remainingQty = parentQty;
    
        return currentChildren.map(child => {
            const newRemainder = remainingQty - child.Allocation;
            remainingQty = newRemainder;
            
            return {
                ...child,
                Remainder: newRemainder
            };
        });
    };

    // Adding a Child
    const addChild = (): void => {
        if (newChildAllocation <= 0) {
            alert("Please enter a valid allocation.");
            return;
        }

        const totalCurrentAllocation = children.reduce((acc, child) => acc + child.Allocation, 0);
        const totalAfterAdding = totalCurrentAllocation + newChildAllocation;

        if (totalAfterAdding > parent.MonthlyQuantity) {
            alert("Adding this child's allocation will exceed the parent's Monthly Quantity.");
            return;
        }

        const newChild: Child = { 
            ChildID: Date.now(),
            Allocation: newChildAllocation ,
            Remainder: 0
        };

        const updatedChildren = computeCascadingRemainders([...children, newChild], parent.MonthlyQuantity);

        setChildren(updatedChildren);
        setNewChildAllocation(0); // Reset the input
    };

    // Removing child data
    const removeChild = (childID: number): void => {
        const updatedChildrenList = children.filter(child => child.ChildID !== childID);
        const updatedChildrenWithRemainder = computeCascadingRemainders(updatedChildrenList, parent.MonthlyQuantity);
        
        setChildren(updatedChildrenWithRemainder);
    };

    const updateChild = (childID: number): void => {
        const updatedChildren = children.map(child => 
            child.ChildID === childID 
            ? { ...child, Allocation: child.Allocation + 10 } 
            : child
        );
    
        const updatedChildrenWithRemainder = computeCascadingRemainders(updatedChildren, parent.MonthlyQuantity);
    
        setChildren(updatedChildrenWithRemainder);
    };

    // Handle save the Child to Database
    const handleSave = (): void => {
        // debugger;
        const totalAllocation = children.reduce((acc, child) => acc + child.Allocation, 0);

        if (totalAllocation !== parent.MonthlyQuantity) {
            alert("The total allocation of children does not match the parent's Monthly Quantity.");
            return;
        }

        // ... Proceed with saving if validation is successful
    };

    return (
        <div>
            {/* Render parent data */}
            <h2>Parent Monthly Quantity: {parent.MonthlyQuantity}</h2>

            {/* Form to Create a New Child */}
            <div>
                <h3>Create New Child</h3>
                <label>
                    Allocation: 
                    <input 
                        type="number" 
                        value={newChildAllocation}
                        onChange={handleInputChange}
                    />
                </label>
                <button onClick={addChild}>Add Child</button>
            </div>

            <hr />

            {/* Render children */}
            <h3>Children Allocations</h3>
            {children.map((child, index) => (
                <div key={child.ChildID}>
                    Allocation for Child {child.ChildID}: {child.Allocation}
                    <span> | Remainder: {child.Remainder}</span>
                    
                    {/* <button onClick={() => updateChild(child.ChildID)}>Update (+10)</button> */}

                    {index !== 0 && <button onClick={() => removeChild(child.ChildID)}>Remove</button>}

                </div>
            ))}

            <button onClick={handleSave}>Save All</button>
        </div>
    );
}

