package com.cmpe451.interesthub.fragments;

import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;

import com.cmpe451.interesthub.InterestHub;
import com.cmpe451.interesthub.R;
import com.cmpe451.interesthub.adapters.UserAdapter;
import com.cmpe451.interesthub.models.User;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link GroupUsers.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link GroupUsers#newInstance} factory method to
 * create an instance of this fragment.
 */
public class GroupUsers extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private long mParam2;

    private OnFragmentInteractionListener mListener;
    List<User> userList;
    InterestHub hub;
    ListView list;

    public GroupUsers() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment UserRecommendations.
     */
    // TODO: Rename and change types and number of parameters
    public static GroupUsers newInstance(String param1, long param2) {
        GroupUsers fragment = new GroupUsers();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putLong(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getLong(ARG_PARAM2);
        }
        hub = (InterestHub) getActivity().getApplication();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View  view =inflater.inflate(R.layout.fragment_group_users, container, false);
        list = view.findViewById(R.id.groupUserList);
        userList  = new ArrayList<User>();
        hub.getApiService().getGroupMembers(mParam2).enqueue(new Callback<List<User>>() {
            @Override
            public void onResponse(Call<List<User>> call, Response<List<User>> response) {
                if(response.body()!=null)
                    for(User u : response.body())
                        userList.add(u);
                UserAdapter adapter = new UserAdapter(getContext(),android.R.layout.simple_list_item_1,userList);
                list.setAdapter(adapter);

            }

            @Override
            public void onFailure(Call<List<User>> call, Throwable t) {

            }
        });
        return view;
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }


    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }
}
